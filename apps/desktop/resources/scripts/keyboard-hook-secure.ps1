
# Timeless Heroes - Secure Keyboard Hook Agent
# 
# SECURITY FEATURES:
# 1. ANONYMIZATION: Never sends actual key codes or characters
#    Only sends key CATEGORIES (CHAR, MODIFIER, FUNCTION, etc.)
# 2. JWT Authentication: Authenticates with server before sending events
# 3. Anti-cheat timing: Includes timing data for heuristic analysis
#
# This script is designed to be PRIVACY-SAFE for educational purposes

param(
    [string]$ServerHost = "127.0.0.1",
    [int]$ServerPort = 9999,
    [string]$Token = ""
)

Add-Type -TypeDefinition @"
using System;
using System.IO;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;
// Removed System.Text.Json for backward compatibility with PowerShell 5.1

public class SecureKeyboardHook {
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    
    private static LowLevelKeyboardProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;
    private static TcpClient client;
    private static NetworkStream stream;
    private static int keyCount = 0;
    private static DateTime startTime = DateTime.Now;
    private static long lastKeyTime = 0;
    private static string sessionId = "";
    private static string userId = "";
    private static string jwtToken = "";
    private static bool isAuthenticated = false;
    
    // Key categories - ANONYMIZED
    private const string CAT_CHAR = "CHAR";
    private const string CAT_MODIFIER = "MODIFIER";
    private const string CAT_FUNCTION = "FUNCTION";
    private const string CAT_NAVIGATION = "NAVIGATION";
    private const string CAT_ENTER = "ENTER";
    private const string CAT_SPACE = "SPACE";
    private const string CAT_BACKSPACE = "BACKSPACE";
    private const string CAT_TAB = "TAB";
    private const string CAT_UNKNOWN = "UNKNOWN";
    
    public delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);
    
    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);
    
    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);
    
    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);
    
    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);
    
    public static void Main(string[] args) {
        string serverHost = args.Length > 0 ? args[0] : "127.0.0.1";
        int serverPort = args.Length > 1 ? int.Parse(args[1]) : 9999;
        jwtToken = args.Length > 2 ? args[2] : "";
        
        // Hide Console logging to keep it clean (electron handles logs)
        // Console.Clear();
        
        if (string.IsNullOrEmpty(jwtToken)) {
            Console.WriteLine("[ERROR] JWT Token required!");
            return;
        }
        
        // Connect and authenticate
        if (!ConnectAndAuth(serverHost, serverPort)) {
            Console.WriteLine("[ERROR] Failed to connect or authenticate");
            return;
        }
        
        Console.WriteLine("[OK] Authenticated as: " + userId);
        Console.WriteLine("[OK] Keylogger Hook Active");
        
        _hookID = SetHook(_proc);
        
        // Update display timer (removed console positioning for Electron compatibility)
        var timer = new System.Threading.Timer(UpdateDisplay, null, 0, 5000); // Less frequent updates
        
        Application.Run();
        
        UnhookWindowsHookEx(_hookID);
    }
    
    private static bool ConnectAndAuth(string host, int port) {
        try {
            client = new TcpClient(host, port);
            stream = client.GetStream();
            
            // Manual JSON construction avoiding System.Text.Json
            string json = String.Format("{{\"pattern\":\"auth\",\"data\":{{\"token\":\"{0}\"}}}}", jwtToken);
            
            byte[] data = Encoding.UTF8.GetBytes(json + "\n");
            stream.Write(data, 0, data.Length);
            
            // Read response
            byte[] buffer = new byte[4096];
            int bytesRead = stream.Read(buffer, 0, buffer.Length);
            string response = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            
            // Parse response (simplified)
            if (response.Contains("\"success\":true")) {
                sessionId = ExtractJsonValue(response, "sessionId");
                userId = ExtractJsonValue(response, "userId");
                isAuthenticated = true;
                return true;
            }
            
            return false;
        } catch (Exception ex) {
            Console.WriteLine("[ERROR] Connection error: " + ex.Message);
            return false;
        }
    }
    
    private static string ExtractJsonValue(string json, string key) {
        try {
            int keyStart = json.IndexOf("\"" + key + "\":\"");
            if (keyStart == -1) return "";
            keyStart += key.Length + 4; // length of "":""
            int keyEnd = json.IndexOf("\"", keyStart);
            if (keyEnd == -1) return "";
            return json.Substring(keyStart, keyEnd - keyStart);
        } catch { return ""; }
    }
    
    private static void UpdateDisplay(object state) {
        // Just keep alive log
        // Console.WriteLine("Status: " + (isAuthenticated ? "Connected" : "Disconnected") + ", Keys: " + keyCount);
    }
    
    private static IntPtr SetHook(LowLevelKeyboardProc proc) {
        using (var curProcess = System.Diagnostics.Process.GetCurrentProcess())
        using (var curModule = curProcess.MainModule) {
            return SetWindowsHookEx(WH_KEYBOARD_LL, proc, GetModuleHandle(curModule.ModuleName), 0);
        }
    }
    
    private static string CategorizeKey(int vkCode) {
        if ((vkCode >= 16 && vkCode <= 18) || (vkCode >= 91 && vkCode <= 92) || (vkCode >= 160 && vkCode <= 165)) return CAT_MODIFIER;
        if (vkCode >= 112 && vkCode <= 123) return CAT_FUNCTION;
        if (vkCode >= 33 && vkCode <= 40) return CAT_NAVIGATION;
        if (vkCode == 13) return CAT_ENTER;
        if (vkCode == 32) return CAT_SPACE;
        if (vkCode == 8 || vkCode == 46) return CAT_BACKSPACE;
        if (vkCode == 9) return CAT_TAB;
        if ((vkCode >= 48 && vkCode <= 57) || (vkCode >= 65 && vkCode <= 90)) return CAT_CHAR;
        if (vkCode >= 186 && vkCode <= 222) return CAT_CHAR;
        return CAT_UNKNOWN;
    }
    
    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN && isAuthenticated) {
            int vkCode = Marshal.ReadInt32(lParam);
            keyCount++;
            
            long currentTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;
            long deltaMs = lastKeyTime > 0 ? currentTime - lastKeyTime : 100;
            lastKeyTime = currentTime;
            
            string category = CategorizeKey(vkCode);
            
            if (stream != null && client.Connected) {
                try {
                    // Manual JSON construction
                    string json = String.Format(
                        "{{\"pattern\":\"key_press\",\"data\":{{\"userId\":\"{0}\",\"sessionId\":\"{1}\",\"keyCategory\":\"{2}\",\"timestamp\":{3},\"deltaMs\":{4}}}}}", 
                        userId, sessionId, category, currentTime, deltaMs);
                        
                    byte[] data = Encoding.UTF8.GetBytes(json + "\n");
                    stream.Write(data, 0, data.Length);
                } catch {
                    isAuthenticated = false;
                    Console.WriteLine("[ERROR] Lost connection");
                }
            }
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }
}
"@ -ReferencedAssemblies System.Windows.Forms

# Run the secure keyboard hook
[SecureKeyboardHook]::Main(@($ServerHost, $ServerPort.ToString(), $Token))

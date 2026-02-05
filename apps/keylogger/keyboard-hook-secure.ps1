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
using System.Text.Json;

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
        
        Console.Clear();
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("");
        Console.WriteLine("  ╔════════════════════════════════════════════════════════╗");
        Console.WriteLine("  ║           TIMELESS HEROES - SECURE AGENT               ║");
        Console.WriteLine("  ║              ~ Code Your Way to Glory ~                ║");
        Console.WriteLine("  ╠════════════════════════════════════════════════════════╣");
        Console.WriteLine("  ║  🔐 PRIVACY MODE: Key values are NEVER transmitted    ║");
        Console.WriteLine("  ║  📊 Only anonymized categories (CHAR, ENTER, etc.)    ║");
        Console.WriteLine("  ╚════════════════════════════════════════════════════════╝");
        Console.WriteLine("");
        Console.ResetColor();
        
        if (string.IsNullOrEmpty(jwtToken)) {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("  [ERROR] JWT Token required!");
            Console.WriteLine("  Usage: keyboard-hook-secure.ps1 -Token <your_jwt_token>");
            Console.WriteLine("");
            Console.WriteLine("  Get your token from: http://localhost:3001/game/settings");
            Console.ResetColor();
            return;
        }
        
        // Connect and authenticate
        if (!ConnectAndAuth(serverHost, serverPort)) {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("  [ERROR] Failed to connect or authenticate");
            Console.ResetColor();
            return;
        }
        
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("  [OK] Authenticated as: " + userId);
        Console.WriteLine("  [OK] Session: " + sessionId.Substring(0, Math.Min(20, sessionId.Length)) + "...");
        Console.ResetColor();
        Console.WriteLine("");
        Console.WriteLine("  Dashboard: http://localhost:3001/game");
        Console.WriteLine("  Press Ctrl+C to quit");
        Console.WriteLine("");
        Console.WriteLine("  ══════════════════════════════════════════════════════════");
        
        _hookID = SetHook(_proc);
        
        // Update display timer
        var timer = new System.Threading.Timer(UpdateDisplay, null, 0, 500);
        
        Application.Run();
        
        UnhookWindowsHookEx(_hookID);
    }
    
    private static bool ConnectAndAuth(string host, int port) {
        try {
            client = new TcpClient(host, port);
            stream = client.GetStream();
            
            // Send auth request (NestJS TCP protocol format)
            var authRequest = new {
                pattern = "auth",
                data = new { token = jwtToken }
            };
            
            string json = JsonSerializer.Serialize(authRequest);
            byte[] data = Encoding.UTF8.GetBytes(json + "\n");
            stream.Write(data, 0, data.Length);
            
            // Read response
            byte[] buffer = new byte[4096];
            int bytesRead = stream.Read(buffer, 0, buffer.Length);
            string response = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            
            // Parse response (simplified)
            if (response.Contains("\"success\":true")) {
                // Extract sessionId and userId from response
                int sidStart = response.IndexOf("\"sessionId\":\"") + 13;
                int sidEnd = response.IndexOf("\"", sidStart);
                if (sidStart > 12 && sidEnd > sidStart) {
                    sessionId = response.Substring(sidStart, sidEnd - sidStart);
                }
                
                int uidStart = response.IndexOf("\"userId\":\"") + 10;
                int uidEnd = response.IndexOf("\"", uidStart);
                if (uidStart > 9 && uidEnd > uidStart) {
                    userId = response.Substring(uidStart, uidEnd - uidStart);
                }
                
                isAuthenticated = true;
                return true;
            }
            
            return false;
        } catch (Exception ex) {
            Console.WriteLine("  Connection error: " + ex.Message);
            return false;
        }
    }
    
    private static void UpdateDisplay(object state) {
        var elapsed = DateTime.Now - startTime;
        double rate = keyCount / Math.Max(1, elapsed.TotalMinutes);
        
        Console.SetCursorPosition(0, 18);
        Console.ForegroundColor = ConsoleColor.White;
        Console.Write("  Keys: ");
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.Write(keyCount.ToString().PadRight(10));
        Console.ForegroundColor = ConsoleColor.White;
        Console.Write("  Rate: ");
        Console.ForegroundColor = ConsoleColor.Magenta;
        Console.Write((rate.ToString("F1") + " /min").PadRight(15));
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(isAuthenticated ? "[CONNECTED]" : "[DISCONNECTED]");
        Console.ResetColor();
    }
    
    private static IntPtr SetHook(LowLevelKeyboardProc proc) {
        using (var curProcess = System.Diagnostics.Process.GetCurrentProcess())
        using (var curModule = curProcess.MainModule) {
            return SetWindowsHookEx(WH_KEYBOARD_LL, proc, GetModuleHandle(curModule.ModuleName), 0);
        }
    }
    
    /// <summary>
    /// CRITICAL: This method ANONYMIZES the key before transmission.
    /// The actual key code (vkCode) is NEVER sent to the server.
    /// Only the CATEGORY of the key is transmitted.
    /// </summary>
    private static string CategorizeKey(int vkCode) {
        // Modifier keys (16-18, 91-92, 160-165)
        if ((vkCode >= 16 && vkCode <= 18) || 
            (vkCode >= 91 && vkCode <= 92) || 
            (vkCode >= 160 && vkCode <= 165)) {
            return CAT_MODIFIER;
        }
        
        // Function keys (112-123 = F1-F12)
        if (vkCode >= 112 && vkCode <= 123) {
            return CAT_FUNCTION;
        }
        
        // Navigation (33-40 = PgUp, PgDn, End, Home, Arrows)
        if (vkCode >= 33 && vkCode <= 40) {
            return CAT_NAVIGATION;
        }
        
        // Special keys
        if (vkCode == 13) return CAT_ENTER;
        if (vkCode == 32) return CAT_SPACE;
        if (vkCode == 8 || vkCode == 46) return CAT_BACKSPACE; // Backspace or Delete
        if (vkCode == 9) return CAT_TAB;
        
        // Alphanumeric (48-57 = 0-9, 65-90 = A-Z)
        if ((vkCode >= 48 && vkCode <= 57) || (vkCode >= 65 && vkCode <= 90)) {
            return CAT_CHAR;
        }
        
        // Other printable characters
        if (vkCode >= 186 && vkCode <= 222) {
            return CAT_CHAR;
        }
        
        return CAT_UNKNOWN;
    }
    
    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN && isAuthenticated) {
            int vkCode = Marshal.ReadInt32(lParam);
            keyCount++;
            
            // Calculate timing for anti-cheat
            long currentTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;
            long deltaMs = lastKeyTime > 0 ? currentTime - lastKeyTime : 100;
            lastKeyTime = currentTime;
            
            // ANONYMIZE: Convert key code to category
            string category = CategorizeKey(vkCode);
            
            // Send ONLY the category, NEVER the actual key
            if (stream != null && client.Connected) {
                try {
                    var keyEvent = new {
                        pattern = "key_press",
                        data = new {
                            userId = userId,
                            sessionId = sessionId,
                            keyCategory = category,  // ANONYMIZED!
                            timestamp = currentTime,
                            deltaMs = deltaMs
                            // NOTE: vkCode is intentionally NOT included
                        }
                    };
                    
                    string json = JsonSerializer.Serialize(keyEvent);
                    byte[] data = Encoding.UTF8.GetBytes(json + "\n");
                    stream.Write(data, 0, data.Length);
                } catch {
                    isAuthenticated = false;
                }
            }
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }
}
"@ -ReferencedAssemblies System.Windows.Forms, System.Text.Json

# Run the secure keyboard hook
[SecureKeyboardHook]::Main(@($ServerHost, $ServerPort.ToString(), $Token))

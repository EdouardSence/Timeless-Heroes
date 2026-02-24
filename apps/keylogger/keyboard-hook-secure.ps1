# Timeless Heroes - Secure Keyboard Hook Agent (HTTP REST)
# 
# SECURITY FEATURES:
# 1. ANONYMIZATION: Never sends actual key codes or characters
#    Only sends key CATEGORIES (CHAR, MODIFIER, FUNCTION, etc.)
# 2. JWT Authentication: Authenticates with server before sending events
# 3. Anti-cheat timing: Includes timing data for heuristic analysis
# 4. AUTO-RECONNECTION: Retries on server failure with exponential backoff
#
# This script is designed to be PRIVACY-SAFE for educational purposes

param(
    [string]$ServerHost = "127.0.0.1",
    [int]$ServerPort = 3000,
    [string]$Token = ""
)

Add-Type -TypeDefinition @"
using System;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Text.Json;

public class SecureKeyboardHook {
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    
    private static LowLevelKeyboardProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;
    private static HttpClient httpClient;
    private static int keyCount = 0;
    private static DateTime startTime = DateTime.Now;
    private static long lastKeyTime = 0;
    private static string sessionId = "";
    private static string userId = "";
    private static string jwtToken = "";
    private static bool isAuthenticated = false;
    private static string baseUrl = "";
    
    // Reconnection state
    private static int reconnectAttempts = 0;
    private static bool isReconnecting = false;
    
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
        int serverPort = args.Length > 1 ? int.Parse(args[1]) : 3000;
        jwtToken = args.Length > 2 ? args[2] : "";
        baseUrl = "http://" + serverHost + ":" + serverPort + "/api/v1/ingest";
        
        // Configure HttpClient with timeout
        httpClient = new HttpClient();
        httpClient.Timeout = TimeSpan.FromSeconds(5);
        
        Console.Clear();
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("");
        Console.WriteLine("  +========================================================+");
        Console.WriteLine("  |           TIMELESS HEROES - SECURE AGENT  (HTTP)        |");
        Console.WriteLine("  |              ~ Code Your Way to Glory ~                 |");
        Console.WriteLine("  +========================================================+");
        Console.WriteLine("  |  PRIVACY MODE: Key values are NEVER transmitted         |");
        Console.WriteLine("  |  Only anonymized categories (CHAR, ENTER, etc.)         |");
        Console.WriteLine("  |  AUTO-RECONNECT: Will retry if server is down           |");
        Console.WriteLine("  +========================================================+");
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
        
        // Connect and authenticate (with retry)
        AuthenticateWithRetry();
        
        if (!isAuthenticated) {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  [WARN] Starting in offline mode - will retry in background");
            Console.ResetColor();
        } else {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("  [OK] Authenticated as: " + userId);
            Console.WriteLine("  [OK] Session: " + sessionId.Substring(0, Math.Min(20, sessionId.Length)) + "...");
            Console.ResetColor();
        }
        
        Console.WriteLine("");
        Console.WriteLine("  Dashboard: http://localhost:3001/game");
        Console.WriteLine("  Press Ctrl+C to quit");
        Console.WriteLine("");
        Console.WriteLine("  ==========================================================");
        
        _hookID = SetHook(_proc);
        
        // Update display timer
        var displayTimer = new System.Threading.Timer(UpdateDisplay, null, 0, 500);
        
        // Background reconnection timer (every 5 seconds)
        var reconnectTimer = new System.Threading.Timer(ReconnectTick, null, 5000, 5000);
        
        Application.Run();
        
        UnhookWindowsHookEx(_hookID);
    }
    
    /// <summary>
    /// Background reconnection tick - retries auth if disconnected
    /// </summary>
    private static void ReconnectTick(object state) {
        if (!isAuthenticated && !isReconnecting) {
            AuthenticateWithRetry();
        }
        
        // Periodic ping to check connection health
        if (isAuthenticated) {
            try {
                var response = httpClient.GetAsync(baseUrl + "/ping").Result;
                if (!response.IsSuccessStatusCode) {
                    isAuthenticated = false;
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("\n  [WARN] Server unreachable, will reconnect...");
                    Console.ResetColor();
                }
            } catch {
                isAuthenticated = false;
            }
        }
    }
    
    /// <summary>
    /// Authenticate with exponential backoff retry
    /// </summary>
    private static void AuthenticateWithRetry() {
        isReconnecting = true;
        
        for (int attempt = 0; attempt < 3; attempt++) {
            if (Authenticate()) {
                reconnectAttempts = 0;
                isReconnecting = false;
                return;
            }
            
            // Exponential backoff: 1s, 2s, 4s
            int delayMs = (int)Math.Pow(2, attempt) * 1000;
            Thread.Sleep(delayMs);
        }
        
        reconnectAttempts++;
        isReconnecting = false;
    }
    
    /// <summary>
    /// Authenticate via HTTP POST /api/v1/ingest/auth
    /// </summary>
    private static bool Authenticate() {
        try {
            var authPayload = new { token = jwtToken };
            string json = JsonSerializer.Serialize(authPayload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = httpClient.PostAsync(baseUrl + "/auth", content).Result;
            
            if (!response.IsSuccessStatusCode) return false;
            
            string responseBody = response.Content.ReadAsStringAsync().Result;
            
            if (responseBody.Contains("\"success\":true")) {
                // Extract sessionId
                int sidStart = responseBody.IndexOf("\"sessionId\":\"") + 13;
                int sidEnd = responseBody.IndexOf("\"", sidStart);
                if (sidStart > 12 && sidEnd > sidStart) {
                    sessionId = responseBody.Substring(sidStart, sidEnd - sidStart);
                }
                
                // Extract userId
                int uidStart = responseBody.IndexOf("\"userId\":\"") + 10;
                int uidEnd = responseBody.IndexOf("\"", uidStart);
                if (uidStart > 9 && uidEnd > uidStart) {
                    userId = responseBody.Substring(uidStart, uidEnd - uidStart);
                }
                
                isAuthenticated = true;
                reconnectAttempts = 0;
                return true;
            }
            
            return false;
        } catch {
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
        
        if (isAuthenticated) {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("[CONNECTED]   ");
        } else if (isReconnecting) {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write("[RECONNECTING]");
        } else {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("[OFFLINE]     ");
        }
        Console.WriteLine("");
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
        if (vkCode == 8 || vkCode == 46) return CAT_BACKSPACE;
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
    
    /// <summary>
    /// Send key press via HTTP POST - non-blocking with auto-disconnect on failure
    /// </summary>
    private static void SendKeyPress(string category, long timestamp, long deltaMs) {
        if (!isAuthenticated) return;
        
        try {
            var keyEvent = new {
                userId = userId,
                sessionId = sessionId,
                keyCategory = category,
                timestamp = timestamp,
                deltaMs = deltaMs
            };
            
            string json = JsonSerializer.Serialize(keyEvent);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            // Fire-and-forget (don't block the hook callback)
            Task.Run(async () => {
                try {
                    var response = await httpClient.PostAsync(baseUrl + "/key", content);
                    if (!response.IsSuccessStatusCode) {
                        isAuthenticated = false;
                    }
                } catch {
                    isAuthenticated = false;
                }
            });
        } catch {
            isAuthenticated = false;
        }
    }
    
    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN) {
            int vkCode = Marshal.ReadInt32(lParam);
            keyCount++;
            
            // Calculate timing for anti-cheat
            long currentTime = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;
            long deltaMs = lastKeyTime > 0 ? currentTime - lastKeyTime : 100;
            lastKeyTime = currentTime;
            
            // ANONYMIZE: Convert key code to category
            string category = CategorizeKey(vkCode);
            
            // Send via HTTP (non-blocking)
            SendKeyPress(category, currentTime, deltaMs);
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }
}
"@ -ReferencedAssemblies System.Windows.Forms, System.Text.Json, System.Net.Http

# Run the secure keyboard hook
[SecureKeyboardHook]::Main(@($ServerHost, $ServerPort.ToString(), $Token))

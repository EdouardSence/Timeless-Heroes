# Timeless Heroes - Global Keyboard Hook
# This script captures ALL keyboard inputs on Windows

Add-Type -TypeDefinition @"
using System;
using System.IO;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

public class KeyboardHook {
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    
    private static LowLevelKeyboardProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;
    private static TcpClient client;
    private static StreamWriter writer;
    private static int keyCount = 0;
    private static DateTime startTime = DateTime.Now;
    
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
    
    public static void Main() {
        Console.Clear();
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("");
        Console.WriteLine("  ======================================================");
        Console.WriteLine("                   TIMELESS HEROES                       ");
        Console.WriteLine("               ~ Code Your Way to Glory ~                ");
        Console.WriteLine("  ======================================================");
        Console.WriteLine("");
        Console.WriteLine("  Le programme capture TOUTES vos frappes clavier.");
        Console.WriteLine("  Chaque touche = +1 LoC (Line of Code)");
        Console.WriteLine("");
        Console.WriteLine("  Dashboard: http://localhost:3001/game");
        Console.WriteLine("");
        Console.WriteLine("  Appuyez sur Ctrl+C pour quitter");
        Console.WriteLine("");
        Console.WriteLine("  ======================================================");
        Console.ResetColor();
        
        // Try to connect to the Node.js server
        try {
            client = new TcpClient("127.0.0.1", 9999);
            writer = new StreamWriter(client.GetStream());
            writer.AutoFlush = true;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("  [OK] Connecte au serveur de jeu!");
            Console.ResetColor();
        } catch {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  [!] Mode hors-ligne (serveur non disponible)");
            Console.ResetColor();
        }
        
        Console.WriteLine("");
        
        _hookID = SetHook(_proc);
        
        // Update display timer
        var timer = new System.Threading.Timer(UpdateDisplay, null, 0, 500);
        
        Application.Run();
        
        UnhookWindowsHookEx(_hookID);
    }
    
    private static void UpdateDisplay(object state) {
        var elapsed = DateTime.Now - startTime;
        double rate = keyCount / Math.Max(1, elapsed.TotalMinutes);
        
        Console.SetCursorPosition(0, 18);
        Console.ForegroundColor = ConsoleColor.White;
        Console.Write("  LoC gagnes: ");
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.Write(keyCount.ToString().PadRight(10));
        Console.ForegroundColor = ConsoleColor.White;
        Console.Write("  Frappes/min: ");
        Console.ForegroundColor = ConsoleColor.Magenta;
        Console.WriteLine(rate.ToString("F1").PadRight(10));
        Console.ResetColor();
    }
    
    private static IntPtr SetHook(LowLevelKeyboardProc proc) {
        using (var curProcess = System.Diagnostics.Process.GetCurrentProcess())
        using (var curModule = curProcess.MainModule) {
            return SetWindowsHookEx(WH_KEYBOARD_LL, proc, GetModuleHandle(curModule.ModuleName), 0);
        }
    }
    
    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN) {
            int vkCode = Marshal.ReadInt32(lParam);
            keyCount++;
            
            // Send to server if connected
            if (writer != null) {
                try {
                    writer.WriteLine("KEY:" + vkCode.ToString());
                } catch { }
            }
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }
}
"@ -ReferencedAssemblies System.Windows.Forms

# Run the keyboard hook
[KeyboardHook]::Main()

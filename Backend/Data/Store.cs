using Backend.Models;

namespace Backend.Data
{
    public static class Store
    {
        public static List<Device> Devices { get; set; } = new();
        public static List<Reading> Readings { get; set; } = new();
        public static int NextDeviceId = 1;
        public static int NextReadingId = 1;
    }
}
namespace Backend.Models
{
    public class Reading
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }
        public double Value { get; set; }
        public DateTime Date { get; set; }
    }
}
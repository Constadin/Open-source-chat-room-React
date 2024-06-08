namespace ChatServer.APi.Models
{
   public class DataSignalConnectionUser: UsersAcounts
   {
      
      public string? SignalRId { get; set; }
      public bool IsActive { get; set; }
      public List<string> GroupNames { get; set; } = new List<string>();
   }
}

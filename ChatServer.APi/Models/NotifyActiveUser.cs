namespace ChatServer.APi.Models
{
   public class NotifyActiveUsersResponse
   {
      public int? Id { get; set; }
      public string? SignalRId { get; set; }
      public string? Username { get; set; }
      public string? Message { get; set; }
   }

}

using ChatServer.Api.Models;
using ChatServer.APi.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Text.Json;

namespace ChatServer.APi.Hubs
{
   public class ChatHub : Hub  {

      // A thread-safe list to keep track of user connections.
      private static readonly List<DataSignalConnectionUser> allConnections = new List<DataSignalConnectionUser>();

      public async Task<NotifyActiveUsersResponse> NotifyActiveUsers(DataSignalConnectionUser userSignalR)
      {
         userSignalR.SignalRId = Context.ConnectionId;

         bool isUserAdded = await LogConnectionInfoAsync(userSignalR);

         if (isUserAdded)  
         {
            await Clients.All.SendAsync("ReceiveNotify", "admin", $"{userSignalR.Username} has joined");
                        
            
            // Create the response object
            var response = new NotifyActiveUsersResponse
            {
               Id=userSignalR.Id,
               SignalRId = userSignalR.SignalRId,
               Username = userSignalR.Username,
               Message = $"{userSignalR.Username} has joined"
            };

            // Add the new user connection to the list.
            
            
               allConnections.Add(userSignalR);
            

            // Optionally, add the user to a specified group.
            // await AddUserToGroup(userSignalR.Id, "");

            return response; // Return the response object 
         }
         else
         {
            Context.Abort();
            return null; // Return null if the user is not added
         }
      }



      private async Task<bool> LogConnectionInfoAsync(DataSignalConnectionUser userSignalR)
      {
         string filePath = "signalRconnections.json";
         List<DataSignalConnectionUser> connections;

         // Check if the file exists
         if (File.Exists(filePath))
         {
            // Read the JSON content
            string json = await File.ReadAllTextAsync(filePath);

            // Deserialize the JSON content to a list
            connections = JsonSerializer.Deserialize<List<DataSignalConnectionUser>>(json) ?? new List<DataSignalConnectionUser>();
         }
         else
         {
            // Initialize a new list if the file does not exist
            connections = new List<DataSignalConnectionUser>();
         }

         // Check if the user is already registered
         bool userExists = connections.Any(u => u.Id == userSignalR.Id); // Adjust the condition based on the unique identifier

         if (!userExists)
         {
            // Add the user if not already registered
            connections.Add(userSignalR);

            // Serialize the updated list to JSON
            var options = new JsonSerializerOptions
            {
               WriteIndented = true,
               Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };

            string updatedJson = JsonSerializer.Serialize(connections, options);

            // Write the JSON content to the file
            await File.WriteAllTextAsync(filePath, updatedJson);
            await base.OnConnectedAsync();
            return true;
         }
         else
         {  // If the user is already registered, terminate the connection
            await Clients.Caller.SendAsync("ReceiveNotify", "admin", $"{userSignalR.Username}  is already connected");
            Context.Abort();
            return false;
         }
      }

      public async Task AddUserToGroup(int? clientIdToAdd, string? groupName)
      {
         var targetClient = allConnections.FirstOrDefault(client => client.Id == clientIdToAdd);
         if (targetClient != null)
         {
            await Groups.AddToGroupAsync(targetClient.SignalRId, groupName);

            // Notify the specific client that they were added to the group
            await Clients.Client(targetClient.SignalRId).SendAsync("addedToGroup", targetClient.Username, groupName);

            // Notify all clients that a user has been added to a group
            await Clients.All.SendAsync("useraddedtogroupnotification" ,targetClient.Username, groupName);

            // Add the group name to the user's GroupNames list if it's not already there
            if (!targetClient.GroupNames.Contains(groupName))
            {
               targetClient.GroupNames.Add(groupName);
            }
         }
         else
         {
            // Handle the case where the client with the specified ID is not found
            await Clients.Caller.SendAsync("Error", $"Client with ID {clientIdToAdd} not found.");
         }
      }



      public async Task RemoveUserFromGroup(int? clientIdToRemove, string? groupName)
      {
         var targetClient = allConnections.FirstOrDefault(client => client.Id == clientIdToRemove);
         if (targetClient != null)
         {
            // Remove the client from the specified group.
            await Groups.RemoveFromGroupAsync(targetClient.SignalRId, groupName);
            await Clients.Client(targetClient.SignalRId).SendAsync("removedFromGroup", $"Removed from group: {groupName}");

            //// Remove the group name from the client's GroupNames list.
            ////if (!string.IsNullOrEmpty(groupName))
            ////{
            ////   targetClient.GroupNames.Remove(groupName);
            //}

            // Optional: If you want to remove the client from the allConnections list, uncomment the following line.
            // allConnections.Remove(targetClient);
         }
         else
         {
            // Handle the case where the client with the specified ID is not found.
            await Clients.Caller.SendAsync("Error", $"Client with ID {clientIdToRemove} not found.");
         }
      }


      //public async Task DisconnectUser(string username, string connectionId)
      //{
      //   // Retrieve the connection associated with the provided connection ID
      //   var connection = Context.ConnectionId == connectionId ? Clients.Caller : Clients.Client(connectionId);

      //   // Send a message to the disconnected user
      //   await connection.SendAsync("ReceiveMessages", "admin", $"You have been disconnected by the server.");

      //   // Disconnect the user
      //   await Clients.Client(connectionId).SendAsync("CloseConnection");

      //   string filePath = "signalRconnections.json";
      //   List<DataSignalConnectionUser> connections;

      //   // Check if the file exists
      //   if (File.Exists(filePath))
      //   {
      //      // Read the JSON content
      //      string json = await File.ReadAllTextAsync(filePath);

      //      // Deserialize the JSON content to a list
      //      connections = JsonSerializer.Deserialize<List<DataSignalConnectionUser>>(json) ?? new List<DataSignalConnectionUser>();
      //   }
      //   else
      //   {
      //      connections = new List<DataSignalConnectionUser>();
      //   }

      //   // Remove the user with the given connectionId
      //   connections = connections.Where(u => u.SignalRId != connectionId).ToList();

      //   // Serialize the updated list to JSON
      //   var options = new JsonSerializerOptions
      //   {
      //      WriteIndented = true,
      //      Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
      //   };

      //   string updatedJson = JsonSerializer.Serialize(connections, options);

      //   // Write the JSON content to the file
      //   await File.WriteAllTextAsync(filePath, updatedJson);
      //}



      public async Task SendClickEvent(string messageId)
      {
         // Broadcast the click event to all connected clients
         await Clients.All.SendAsync("ReceiveClickEvent", messageId);
      }


      //Method to send a message to the group
      public async Task SendMessageToGroup(string groupName, string message, string username)
      {
         // Get current date and time
         var currentDate = DateTime.Now;

         // Get date components
         int year = currentDate.Year;
         int month = currentDate.Month;
         int day = currentDate.Day;

         // Get time components
         int hours = currentDate.Hour;
         int minutes = currentDate.Minute;

         // Format date and time as needed
         string formattedDate = $"{month}/{day}/{year}";
         string formattedTime = $"{hours}:{minutes:D2}";

         // Send the message along with the date and time
         await Clients.Group(groupName).SendAsync("ReceiveMessageFrom", username, message, formattedDate, formattedTime);
      }




   }
}


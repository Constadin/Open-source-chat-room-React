using ChatServer.Api.Models;
using ChatServer.APi.Hubs;
using ChatServer.APi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;



namespace ChatServer.API.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class UserAuthController : ControllerBase
   {
      private readonly string _filePath = @"C:\Users\FSdeveloper\Desktop\desktop before reinsl\FSProgramer\CSharp\ChatAroundTheWorld.API - Copy\ChatServer.APi\VirtualData\dbUsersAcounts.json";
      private readonly string _filePathSignalR = @"C:\Users\FSdeveloper\Desktop\desktop before reinsl\FSProgramer\CSharp\ChatAroundTheWorld.API - Copy\ChatServer.APi\signalRconnections.json";
      private readonly IHubContext<ChatHub> _chatHubContext;

      public UserAuthController(IHubContext<ChatHub> chatHubContext)
      {
         _chatHubContext = chatHubContext;
      }

      [HttpPost("login")]
      public async Task<IActionResult> Login(UsersAcounts userModel)  //class Model 
      {
         

         if (!ModelState.IsValid)
         {
            return BadRequest(ModelState);
         }
         var users = await GetUsersFromJsonAsync(_filePath);//read file UserAcount info dbUsersAcounts.json 

         var authUserModel = users.FirstOrDefault(u => u.Username == userModel.Username && u.Password == userModel.Password);

         if (authUserModel != null)
         {   
            
            await Task.Delay(3); // Καθυστέρηση 5 millisecond
            await SaveUsersToJsonAsync(users, _filePath); //Update state is active in file/ UserAcount info class Model save to file dbUsersAcounts.json


            return Ok(new
            {
               authUserModel.Id,
               authUserModel.Username,               
               authUserModel.Photo_url,
               

            });
         }
         return Unauthorized();
      }



      [HttpGet("active")]
      public async Task<IActionResult> GetActiveUsers()//connected users  read file signalRconnections.json
      {
         try
         {
            await Task.Delay(5); // Καθυστέρηση 5 millisecond
            // Get all users from the JSON file
            var users = await GetUsersFromSignalRAsync(_filePathSignalR);

            // Filter active users
            var activeUsersList = users.Where(u => u.IsActive==true).ToList();

            return Ok(activeUsersList);
         }
         catch (Exception ex)
         {
            return StatusCode(500, $"An error occurred: {ex.Message}");
         }
      }
            


      private async Task<UsersAcounts[]> GetUsersFromJsonAsync(string filePath) //users  read file  dbUsersAcounts.json
      {
         using var reader = new StreamReader(filePath);

         var json = await reader.ReadToEndAsync();

         // Parse the JSON and convert it to an array of UsersAcounts
         var users = JArray.Parse(json).ToObject<UsersAcounts[]>();

         // Handle the null scenario
         if (users == null)
         {
            // Either return an empty array
            return Array.Empty<UsersAcounts>();
            // or handle it accordingly, for example by throwing an exception
            // throw new InvalidOperationException("Deserialization resulted in null.");
         }
         return users;
      }
      private async Task<DataSignalConnectionUser[]> GetUsersFromSignalRAsync(string filePath)
      {
         using var reader = new StreamReader(filePath);

         var json = await reader.ReadToEndAsync();

         // Parse the JSON and convert it to an array of UsersAcounts
         var users = JArray.Parse(json).ToObject<DataSignalConnectionUser[]>();

         // Handle the null scenario
         if (users == null)
         {
            // Either return an empty array
            return Array.Empty<DataSignalConnectionUser>();
            // or handle it accordingly, for example by throwing an exception
            // throw new InvalidOperationException("Deserialization resulted in null.");
         }
         return users;
      }

      private async Task SaveUsersToJsonAsync(UsersAcounts[] usersModel , string filePath)
      {
         var json = JsonConvert.SerializeObject(usersModel, Formatting.Indented);

         using (var writer = new StreamWriter(filePath))
         {
            await writer.WriteAsync(json);
         }
      }


   }
}
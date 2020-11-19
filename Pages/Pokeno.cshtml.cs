using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Games.Pages
{
    public class Pokeno : PageModel
    {
        public void OnGet()
        {
            ViewData["Fluid"] = true;
        }
    }
}
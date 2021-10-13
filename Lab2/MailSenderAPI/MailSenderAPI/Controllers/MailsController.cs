using MailSenderAPI.Models;
using MailSenderAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MailSenderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailsController : Controller
    {
        private readonly MailService _mailService;

        public MailsController(MailService mailService) => _mailService = mailService;

        [HttpPost]
        public async Task<ActionResult> PostMail([FromBody] MailData mailData)
        {
            if (!MailAddress.TryCreate(mailData.Email, out MailAddress emailAddress))
            {
                ModelState.AddModelError(nameof(mailData.Email), "Email is invalid");
                return ValidationProblem();
            }

            if (!await _mailService.TrySendMailAsync(emailAddress, mailData.Author, mailData.Text))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            return Ok(new
            {
                mailData.Email,
                mailData.Author,
                mailData.Text
            });
        }
    }
}

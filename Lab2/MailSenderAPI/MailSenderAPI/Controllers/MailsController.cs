using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Ganss.XSS;
using MailSenderAPI.Models;
using MailSenderAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace MailSenderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class MailsController : Controller
    {
        private readonly MailService _mailService;

        public MailsController(MailService mailService) => _mailService = mailService;

        [HttpPost]
        public async Task<ActionResult> PostMail([FromBody] MailData mailData)
        {
            HtmlSanitizer sanitizer = new ();
            string sanitizedHtml = sanitizer.Sanitize(mailData.Text);

            if (!MailAddress.TryCreate(mailData.Email, out MailAddress emailAddress))
            {
                ModelState.AddModelError(nameof(mailData.Email), "Email is invalid");
                return ValidationProblem();
            }

            if (!await _mailService.TrySendMailAsync(emailAddress, mailData.Author, sanitizedHtml))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            return Ok(new
            {
                mailData.Email,
                mailData.Author,
                body = sanitizedHtml
            });
        }
    }
}

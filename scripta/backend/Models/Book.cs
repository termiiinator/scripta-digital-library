namespace Scripta.API.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public string CoverUrl { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string Badge { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public int DownloadCount { get; set; }
    }
}

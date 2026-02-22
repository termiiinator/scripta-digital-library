from main.models import Book

def genres_context(request):
    genres = Book.objects.values_list('genre', flat=True).distinct()
    return {'genres': genres}

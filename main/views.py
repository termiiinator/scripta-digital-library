import os
from django.shortcuts import render, get_object_or_404
from django.http import FileResponse, Http404
from django.views.decorators.clickjacking import xframe_options_exempt
from .models import Book
from .forms import FeedbackForm


def index(request):
    books_new = Book.objects.filter(status='new').order_by('-id')[:5]
    books_recommended = Book.objects.filter(status='recommended').order_by('-id')[:5]
    books_best = Book.objects.filter(status='best').order_by('-id')[:5]
    books_regular = Book.objects.filter(status='regular')   
    return render(request, 'main/index.html', {
        'title': 'Scripta - Онлайн библиотека',
        'books_new': books_new,
        'books_recommended': books_recommended,
        'books_best': books_best,
        'books_regular': books_regular,
    })

def about(request):
    from django.shortcuts import redirect
    success = request.GET.get('success')
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/about/?success=1')
    else:
        form = FeedbackForm()
    return render(request, 'main/about.html', {'form': form, 'success': success})

def catalog(request):
    query = request.GET.get('q', '').strip()
    books = Book.objects.all()
    if query:
        books = books.filter(title__icontains=query)
    # Фильтр по катер
    selected_categories = request.GET.getlist('category')
    if selected_categories:
        books = books.filter(status__in=selected_categories)

    # Фильтр жанры
    selected_genres = request.GET.getlist('genre')
    if selected_genres:
        books = books.filter(genre__in=selected_genres)

    # Для отображения
    genres = Book.objects.values_list('genre', flat=True).distinct()

    return render(request, 'main/catalog.html', {
        'books': books,
        'genres': genres,
        'selected_categories': selected_categories,
        'selected_genres': selected_genres,
    })


def book_detail(request, pk):
    book = get_object_or_404(Book, pk=pk)
    return render(request, 'main/book.html', {'book': book})

def privacy(request):
    return render(request, 'main/privacy.html')

@xframe_options_exempt
def serve_book_pdf(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if not book.pdf_file:
        raise Http404("PDF-файл для этой книги не найден.")
    pdf_path = book.pdf_file.path
    if not os.path.exists(pdf_path):
        raise Http404("Файл не найден на диске.")
    filename = os.path.basename(pdf_path)
    response = FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{filename}"'
    return response 

def create(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return render(request, 'main/create_success.html')
    else:
        form = FeedbackForm()
    return render(request, 'main/create.html', {'form': form})
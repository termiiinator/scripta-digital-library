from django.db import models


class Book(models.Model):
    STATUS_CHOICES = [
        ('regular', 'Обычная'),
        ('new', 'Новинка'),
        ('recommended', 'Рекомендуем'),
        ('best', 'Лучшие'),
    ]
    title = models.CharField('Название', max_length=200)
    author = models.CharField('Автор', max_length=100)
    published_date = models.PositiveIntegerField('Год публикации')
    genre = models.CharField('Жанр', max_length=50)
    language = models.CharField('Язык', max_length=50)
    pages = models.PositiveIntegerField('Страницы')
    description = models.TextField('Описание')
    rating = models.FloatField('Оценка')
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    pdf_file = models.FileField('PDF-файл', upload_to='books/', blank=True, null=True)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='regular', db_index=True)

    def __str__(self):
        return self.title   
    
class Feedback(models.Model):
    user_name = models.CharField('Имя пользователя', max_length=50)
    email = models.EmailField('Электронная почта')
    comment = models.TextField('Комментарий')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    def __str__(self): 
        return f"{self.user_name} ({self.email}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
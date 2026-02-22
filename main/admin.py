from django.contrib import admin
from .models import Book
from .models import Feedback

admin.site.register(Book)
admin.site.register(Feedback)

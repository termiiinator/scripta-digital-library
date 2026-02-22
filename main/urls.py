from django.urls import path
from . import views
from .views import create

urlpatterns = [
    path('', views.index, name='home'),
    path('catalog/', views.catalog, name='catalog'),
    path('book/<int:pk>/', views.book_detail, name='book_detail'),
    path('book/<int:pk>/pdf/', views.serve_book_pdf, name='book_pdf'),
    path('privacy/', views.privacy, name='privacy'),
    path('about/', views.about, name='about'),
    path('feedback/', create, name='feedback'),
]

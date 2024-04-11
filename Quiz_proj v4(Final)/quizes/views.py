from django.shortcuts import render
from django.http import HttpResponse
from .models import Quiz
from django.views.generic import ListView

# Create your views here.

def home_page(request):
    return render(request,'quizes/index.html')

def anime_view(request):
    return render(request, 'quiz_type/quiz.html')
    #return HttpResponse("This is Anime View")

def football_view(request):
    #return render(request, 'quizes/football.html')
    return render(request, 'quiz_type/quiz.html')

def iq_view(request):
    #return render(request, 'quizes/iq.html')
    return render(request, 'quiz_type/quiz.html')

def movie_view(request):
    #return render(request, 'quizes/football.html')
    return render(request, 'quiz_type/quiz.html')
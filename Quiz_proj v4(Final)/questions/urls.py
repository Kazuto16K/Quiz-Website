from django.urls import path
from django.shortcuts import render
from .views import get_quiz

urlpatterns = [
    path('',get_quiz, name="quizAPI")
]
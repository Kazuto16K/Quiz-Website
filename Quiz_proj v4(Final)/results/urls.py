from django.urls import path,include
from .views import submit_score,leaderboard_api

urlpatterns = [
    path('leaderboard/',leaderboard_api,name="leaderboard"),
    path('',submit_score,name='submit_score')
]
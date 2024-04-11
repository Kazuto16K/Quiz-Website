from django.urls import path,include
from .views import *

app_name = 'quizes'

urlpatterns = [
    path('',home_page),
    path('anime/',anime_view),
    path('football/',football_view),
    path('iq/',iq_view),
    path('movie/',movie_view),
    path('api-quiz/',include('questions.urls')),
    path('results/',include('results.urls'))
]
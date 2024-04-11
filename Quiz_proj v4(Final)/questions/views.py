from django.shortcuts import render
from django.http import JsonResponse
from .models import Question

# Create your views here.

def get_quiz(request):
    Question_objs = Question.objects.all()
    Question_objs = list(Question_objs)
    data=[]
    for q in Question_objs:
        data.append({
            "quiz":q.quiz.name,
            "text":q.text,
            "answers":list(q.get_answers().values())
        })
    
    payload = {'status':True,'data':data}
    return JsonResponse(payload)    
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse,HttpResponseRedirect
from .models import Result
import json
from jinja2 import Environment,FileSystemLoader



# Create your views here.

def submit_score(request):
    
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            name1= data.get('name')
            score1= data.get('score')
            quiz_type=data.get('quiz_type')

            #quiz_instance = Quiz.objects.get(name=quiz_type)

            print(name1,quiz_type,"These Data extracted")

            Result.objects.create(name=name1,score=score1,quiz=quiz_type)

            
            redirect_url = "http://127.0.0.1:8000/results/leaderboard"+ f'?quiz_type={quiz_type}'
            print(redirect_url)

            return HttpResponseRedirect(redirect_url)


        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=400)
    
def leaderboard_api(request):

    quiz_type = request.GET.get('quiz_type','')
    print(quiz_type)

    Result_obj = Result.objects.filter(quiz=quiz_type)
    Result_obj= list(Result_obj)
    
    data=[]
    for obj in Result_obj:
        data.append({
            "quiz":obj.quiz,
            "name":obj.name,
            "score":obj.score
        })
    
    sorted_result = sorted(data,key=lambda x:(x['score'],x['name']),reverse=True)
    
    top10 = []
    c=0
    for sr in sorted_result:
  
            if(c<10):
                top10.append(sr)
                c=c+1
            else:
                break
    #payload = {'status':True,'top10':top10}
    for i, entry in enumerate(top10, start=1):
        entry['index'] = i

    return render(request, 'leaderboard.html', {'top10': top10})
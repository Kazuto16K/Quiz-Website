from django.db import models
from quizes.models import Quiz
from django.contrib.auth.models import User

# Create your models here.
class Result(models.Model):
    #quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    quiz = models.CharField(max_length=10, default=None)
    #user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.FloatField()
    name = models.CharField(max_length=20, default=None)

    def __str__(self):
        return str(self.pk)
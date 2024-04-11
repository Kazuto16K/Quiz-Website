from django.db import models

# Create your models here.

class Quiz(models.Model):
    name = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    number_of_questions = models.IntegerField()
    required_score_to_pass = models.IntegerField(help_text="Required Score to Pass")

    def __str__(self):
        return f"{self.name}-{self.topic}"
    
    def get_questions(self):
        return self.question_set.all()[:self.number_of_questions]   #the syntax in sq bracket limits the number of questions that can be added
    
    class Meta:
        verbose_name_plural= 'Quizes'
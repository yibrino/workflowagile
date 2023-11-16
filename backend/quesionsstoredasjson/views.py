# examnet/views.py
# Allows to create HTTP response with Json Content
from django.http import JsonResponse

def get_items(request):

 data = {
  
    'questions': [
            {
                'question': 'What is the primary goal of the Daily Scrum in a Scrum team?',
                'choices': ['To provide a status update to the Product Owner', ' To discuss and plan for the next sprint', 'To identify and remove impediments to progress', 'To review the teams performance over the last sprint'],
                'correct_answer': 'Paris',
            },
            {
                'question': 'Who is responsible for maintaining the Product Backlog in a Scrum team?',
                'choices': ['Scrum Master', 'Development Team', 'Product Owner', 'Stakeholders'],
                'correct_answer': 'Mars',
            },
             {
                'question': 'In Scrum, what is the purpose of the Sprint Review?',
                'choices': ['To inspect the Increment and adapt the Product Backlog', ' To inspect the work completed and adapt the Sprint Backlog', 'To inspect the product increment and gather feedback', 'To inspect the teams performance and adapt the Definition of Done'],
                'correct_answer': 'Mars',
            },
            

        ]
           }
 return JsonResponse(data)

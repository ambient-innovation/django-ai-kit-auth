from django.http import HttpResponse


def unauthorized(request):
    return HttpResponse(status=401)

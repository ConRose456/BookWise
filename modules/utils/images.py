import uuid
import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# function to upload image to storage and get public url
def upload_image(request):
    if 'image' in request.files:
        image = request.files['image']
        filename = image.filename
        unique_filename = f"{uuid.uuid4()}_{filename}"
    
        file_content = image.read()

        # upload image to s3 storage in supabase
        response = supabase.storage.from_('book_images').upload(unique_filename, file_content)
        return get_image_url(response, unique_filename)
    
    # return empty sting if no image as image is not required to make book contribution
    return ""

# function to get image public url
def get_image_url(response, unique_filename):
    if (response.status_code == 200):
        return supabase.storage.from_('book_images').get_public_url(unique_filename)
    return ""
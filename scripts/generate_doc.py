from pdf2image import convert_from_path
from os import system
from PIL import Image

print("generate latex pdf...")
system("pdflatex -output-directory resources resources/grammar_spec.tex")

print("generate images...")
images = convert_from_path("resources/grammar_spec.pdf", dpi=600)

def crop(image):
    data = image.getdata()
    width = image.width
    rows = image.height

    def is_empty_row(row):
        for x in range(0, width):
            if data.getpixel((x, row)) != (255,255,255):
                return False
        return True
    
    def find_non_empty_row():
        for row in range(rows - 1, 0, -1):
            if not is_empty_row(row):
                return row
        return 0
    
    row = find_non_empty_row() + 200
    return image.crop((0,0,width,row))
    
cropped_images = [ crop(image) for image in images ]

total_width = max([image.width for image in cropped_images])
total_height = sum([image.height for image in cropped_images])
final_image = Image.new("RGB", (total_width, total_height))

offset = 0
for image in cropped_images:
    final_image.paste(image, (0, offset))
    offset += image.height

final_image.save(f"resources/generated/grammar_spec.png", "PNG")


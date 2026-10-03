import re
import io

def get_classes():
    with io.open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    classes = re.findall(r'class=\"([^\"]+)\"', html)
    class_set = set()
    for c in classes:
        class_set.update(c.split())
    important_classes = sorted([c for c in class_set if any(x in c for x in ['grid', 'flex', 'container', 'card', 'list', 'row', 'col'])])
    print("Classes found:")
    print(important_classes)

get_classes()

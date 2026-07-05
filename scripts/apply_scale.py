import re
import sys

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Insert scale functions at the start of the component
    if "const fs = " not in content:
        insert_point = content.find("const styles = StyleSheet.create({")
        if insert_point != -1:
            scale_funcs = """  const fs = (size: number) => size * (data.fontSizeScale || 1.0);
  const sp = (space: number) => space * (data.lineSpacing || 1.0);
  
  """
            content = content[:insert_point] + scale_funcs + content[insert_point:]

    # Replace fontSize
    # We want to replace `fontSize: 14` with `fontSize: fs(14)`
    # But watch out for `fontSize: (data... ? 18 : 24)`
    # Only replace simple numbers
    content = re.sub(r'fontSize:\s*(\d+(?:\.\d+)?),', r'fontSize: fs(\1),', content)
    
    # Replace spacing properties
    props = ["margin", "marginBottom", "marginTop", "marginLeft", "marginRight", "padding", "paddingBottom", "paddingTop", "paddingLeft", "paddingRight", "gap"]
    for prop in props:
        content = re.sub(rf'{prop}:\s*(\d+(?:\.\d+)?),', rf'{prop}: sp(\1),', content)

    # Some fontsizes are conditional like: fontSize: (data.fullName?.length || 0) > 18 ? 18 : 24
    # We can just leave them alone or replace them manually if needed, but the simple ones will be caught.

    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Processed {filepath}")

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        process_file(arg)

import re

with open('index.html', 'r') as f:
    content = f.read()

# Find projects transition section (from <section id="projects-transition" ... to </section>)
projects_transition_pattern = re.compile(r'(<section id="projects-transition" class="section-projects-transition">\s*<h2 class="projects-huge-title text-center">\s*Hi! <br class="d-md-none"> I\'m Liz\s*</h2>\s*</section>)')
pt_match = projects_transition_pattern.search(content)
pt_content = pt_match.group(1)

# Remove the pt_content from its original place
content = content.replace(pt_content, '')

# Now pt_content needs to be renamed
pt_content = pt_content.replace('id="projects-transition"', 'id="about-transition"')

# Find about section (from <!--//////////////////// ABOUT ME SECTION — New Design ///////////////////// --> to its closing </section>)
# It ends right before <!--//////////////////// PLAYGROUND SECTION ///////////////////// -->
about_pattern = re.compile(r'(    <!--//////////////////// ABOUT ME SECTION — New Design ///////////////////// -->\n    <section id="about" class="about-new">.*?</section>\n)', re.DOTALL)
about_match = about_pattern.search(content)
about_content = about_match.group(1)

# Remove about_content from its original place
content = content.replace(about_content, '')

# We want to insert the new about container right after <main>
main_pattern = re.compile(r'(<main>\n)')
main_match = main_pattern.search(content)

new_about_content = f"""    <!--//////////////////// ABOUT ME SECTION — New Design ///////////////////// -->
    <div id="about-container">
      {pt_content}

{about_content.replace('    <!--//////////////////// ABOUT ME SECTION — New Design ///////////////////// -->\\n', '')}    </div>
"""

# Insert new about content
content = content[:main_match.end()] + new_about_content + content[main_match.end():]

with open('index.html', 'w') as f:
    f.write(content)

print("Done")

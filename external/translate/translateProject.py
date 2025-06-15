import json
import argostranslate.package
import argostranslate.translate

available_packages = argostranslate.package.get_available_packages()
language_codes = set()
for package in available_packages:
    if package.from_code == "en":
        language_codes.add(package.to_code)

json_file_path = "./languages.json"

with open(json_file_path, 'r') as file:
    data = json.load(file)
    with open("./RP/texts/languages.json", 'w') as file2:
        json.dump(data, file2, indent=4)

data = [item for item in data if 'en' not in item]

json_language_codes = set()
for item in data:
    lang_code = item.split('_')[0] if '_' in item else item
    json_language_codes.add(lang_code)

for package in available_packages:
    if package.from_code == "en" and package.to_code in json_language_codes:
        print(f"Downloading {package.to_code}")
        argostranslate.package.install_from_path(package.download())

parts_behind_underscore = [filename.split('_')[0] if '_' in filename else filename for filename in data]

lang_file_path = "./RP/texts/en_US.lang"

key_value_pairs = {}
with open(lang_file_path, 'r', encoding='utf-8') as file:
    for line in file:
        if '=' in line:
            key, value = line.strip().split('=', 1)
            key_value_pairs[key] = value

with open(lang_file_path, 'r', encoding='utf-8') as file:
    rawFileData = file.read()
    with open("./RP/texts/en_GB.lang", 'w', encoding='utf-8') as file2:
        file2.write(rawFileData)

index = 0

for language_code in parts_behind_underscore:
    from_code = "en"
    to_code = language_code
    if to_code in language_codes:
        try:
            translatedKeys = []
            for key, value in key_value_pairs.items():
                if key == "pack.name" or key == "pack.description":
                    translatedKeys.append(f"{key}={value}")
                    continue
                translatedText = argostranslate.translate.translate(value, from_code, to_code)
                print(f"en -> {to_code}: {translatedText}")
                translatedKeys.append(f"{key}={translatedText}")
            with open(f"./RP/texts/{data[index]}.lang", 'w', encoding='utf-8') as file:
                file.write('\n'.join(translatedKeys))
        except AttributeError as e:
            pass
            raise AttributeError(f"Error translating to {to_code}: {e}")
    else:
        raise FileExistsError(f"{to_code} Does not exist in the language codes")
    index += 1

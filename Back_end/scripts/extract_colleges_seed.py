import pathlib
text = pathlib.Path(__file__).resolve().parent.parent.joinpath('seeds.py').read_text(encoding='utf-8')
start = text.index('    colleges_data = [')
end = text.index('    ]\n\n    for c_data in colleges_data:')
block = text[start:end].replace('    colleges_data', 'COLLEGES_SEED_DATA', 1)
header = '"""Backend-only college seed records — loaded into DB at startup."""\n\n'
out = pathlib.Path(__file__).resolve().parent.parent / 'seed_data' / 'colleges_seed_data.py'
out.parent.mkdir(exist_ok=True)
out.write_text(header + block + '\n', encoding='utf-8')
print('OK', out)

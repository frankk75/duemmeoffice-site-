from pathlib import Path
import re,sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'forniture-scuola-siracusa.html')
s=p.read_text(encoding='utf-8')
a=s.index('      <section class="du-catalog-wrap" aria-labelledby="catalogo-esempio-title">')
b=s.index('      <section aria-label="Catalogo categorie"',a)
new=Path(__file__).with_name('NUOVA_SEZIONE_SCOLASTICA.html').read_text(encoding='utf-8')
s=s[:a]+new+'\n\n'+s[b:]
p.write_text(s,encoding='utf-8')
print('Aggiornato:',p)

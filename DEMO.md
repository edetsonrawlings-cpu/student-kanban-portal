# Guide de demonstration orale

Ce guide prepare une demonstration locale stable, sans recompilation Turbopack ni dependance a
une base de donnees ou au Wi-Fi de la salle.

## La veille

- Utiliser la machine qui servira reellement le jour J avec Node.js 20.9 ou plus recent.
- Executer `npm ci`, puis `npm run demo:check`, pendant qu'une connexion reseau est disponible.
- Conserver une copie hors ligne du depot. Une copie de `node_modules` n'est reutilisable de
  maniere fiable que sur le meme systeme et la meme architecture.
- Tester l'URL Vercel de secours et la garder dans les favoris.
- Couper les notifications du systeme et preparer un profil de navigateur propre.

## Dix minutes avant

Depuis la racine du projet :

```bash
npm run demo:check -- 3000
```

Le prevol verifie Node.js, les dependances, le disque, la memoire et le port, puis execute les
quatre controles de la CI : lint, typecheck, tests et build de production. Il ne ferme jamais un
processus existant.

Si le port 3000 est occupe, identifier le service avant de l'arreter, ou choisir un port dedie :

```bash
npm run demo:check -- 3001
npm start -- -p 3001
```

Sinon, lancer :

```bash
npm start -- -p 3000
```

Ouvrir ensuite [http://localhost:3000/dashboard](http://localhost:3000/dashboard). Garder ce
terminal ouvert et utiliser `Ctrl+C` apres la demonstration.

## Affichage dans la salle

- Cliquer sur l'icone d'agrandissement en haut a droite du portail. Le mode presentation masque
  la barre laterale et la recherche, agrandit les cartes et passe en plein ecran. `Echap` le ferme.
- Commencer avec un zoom navigateur de 125 %. Sur un projecteur etroit, revenir a 100 % pour
  conserver les quatre colonnes; utiliser 150 % seulement si une vue en deux colonnes convient.
- Verifier depuis le fond de la salle que les titres, echeances et priorites restent lisibles.
- Fermer les onglets, extensions visibles et notifications sans rapport avec la demonstration.

## Deroule conseille (6 minutes)

1. **Etudiant :** presenter le dashboard, puis ouvrir le Kanban de developpement, sa progression et
  les taches terminees/restantes. Changer de compte Student dans la barre superieure pour montrer
  l'identite, les notes, le GPA et le recu correspondants.
2. **Enseignant :** utiliser les onglets relies du dashboard pour passer a `Teacher`, publier un devoir, modifier la note
  d'Ama dans le gradebook et publier une annonce pour `CS301`. Dans Settings, montrer que le nom,
  l'e-mail, le matricule et l'affiliation de l'enseignant sont modifiables et sauvegardes localement.
3. **Retour Etudiant :** utiliser l'onglet `Student`, puis montrer le nouveau devoir, la note/GPA
  recalculee et l'annonce recue.
4. **Administrateur :** choisir l'onglet `Administrator`, ajouter un professeur avec son matricule,
   creer un cours et le lui affecter, ouvrir la nouvelle fiche, puis rechercher le compte dans
   l'annuaire. Montrer aussi la suspension/reactivation et une annonce institutionnelle.
5. **Enseignant ajoute :** revenir sur `Teacher`, choisir ce professeur dans la barre superieure,
  puis saisir une note, publier un devoir et une annonce pour son nouveau cours.
6. **Etudiant :** verifier que le cours, le devoir, la note et l'annonce sont apparus et que le GPA
  a ete recalcule.
7. Ouvrir Settings et montrer `Reset local data`, sans l'activer avant d'avoir termine la demo.
8. Revenir sur `Administrator` et changer de compte Admin sans changer de role.
9. Terminer par les controles de qualite et l'URL Vercel de secours.

## Reponses techniques courtes

**Pourquoi aucune base de donnees n'est-elle lancee ?**

La demonstration utilise `src/lib/mock-data.ts` comme jeu initial et `localStorage` pour le role,
les actions enseignant/admin et le Kanban. Le schema Prisma decrit la future base PostgreSQL, mais
aucune page ne l'interroge encore. `npm ci` genere le client Prisma sans connexion; aucun fichier
`.env` ni serveur Postgres n'est necessaire pour cette version.

**Les roles sont-ils securises ?**

Non, volontairement. Le selecteur simule trois experiences fonctionnelles pour la soutenance, mais
ne constitue pas une authentification et les routes ne sont pas protegees. En production, il faut
une identite verifiee, une session serveur et un controle d'autorisation sur chaque lecture ou
mutation sensible. L'interface le signale explicitement dans Administration et Settings.

**Comment la qualite est-elle controlee ?**

La CI execute `npm ci`, ESLint, le typecheck TypeScript, les tests Vitest et le build Next.js a
chaque pull request et a chaque push sur `main`. Le prevol local rejoue les quatre controles de
code avant la demonstration.

**Pourquoi ne pas utiliser `npm run dev` ?**

La demonstration sert le build optimise avec `npm start`, ce qui evite les recompilations a la
demande du serveur de developpement.

## Plans de secours

1. **Conflit local :** utiliser le port 3001 apres validation avec le prevol.
2. **Pas de reseau :** utiliser l'installation preparee la veille et la copie hors ligne du depot.
3. **Panne de la machine :** ouvrir le deploiement Vercel depuis un autre ordinateur.
4. **Projecteur peu lisible :** activer le mode presentation et ajuster le zoom avant l'arrivee du
   jury.
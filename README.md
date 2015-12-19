# Traversing DOM Trees

The challenge here is to find given two DOM trees `rootA` and `rootB` and one node that resides in `rootA`, node `n`, get the value of the corresponding node in `rootB`, `findInClone(n) --> m`.

Here's a simple illustration:

```
  rootA      rootB
   / \       / \
  O   O     O   O
     /|\       /|\
    O n O     O m O

  original   clone
```

I've provided two HTML documents `star-wars.html` and `star-trek.html`, both have the same amount of DOM nodes. I'm using `async / await` to perform async operations, for reading the file system and creating a mock DOM using `jsdom`.

# Fastred-BEM

> Visual component library for PHP server and JavaScript frontend.

Based on:

- BEM
- Fastred
- Webpack

Languages:

- Pug
- Stylus
- JavaScript
- PHP

Components:

- pug-php
- Fastred

## File structure of block

Common block file structure looks like this:
```
block
|---block.pug
|---block__item.pug
|---block.styl
|---block.js
|---block.json
|---block.css.styl
```

### block.js

```javascript
require('block/block.css.styl');
template('block', require('block/block.pug'));
template('block__item', require('block/block__item.pug'));
```

### block.styl

Here you declare global stylus variables and mixins and load json with `json` function:

```stylus
$json = json('./block.json', {hash: true})

$block__variable_1 = $json.block__variable_1
$block__variable_2 = #fff

block__mixin()
    color $block__variable_2
```

The file is loaded when you call `@require block` in Stylus files of other blocks. 

> Don't put classes inside `block.styl`. 
> If you do this and use `@require block` more than once in your project, these classes will double in the output CSS.
> `block.css.styl` should be used for defining classes, as it's required only once by `block.js`.

### block.css.styl

Here you declare classes and other stuff that goes to output CSS:

```stylus
@require 'block/block.styl'
@require block1
@require block2

.block
  color $block1__color
  background #fff
  
  &_dark
    background #000
  
.block__item
  color $block2__color
  
  &_size
  
    &_l
      font-size 1.5rem
  
    &_xl
      font-size 2rem
```

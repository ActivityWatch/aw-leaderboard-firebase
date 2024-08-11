Sources - https://sass-guidelin.es


# Variables 

```
// Initialize a global variable at root level.
//All the variables goes in `_variables.scss`
$variable: 'initial value';
```

Example

```scss
$primary-color : "red"; // Variable Declared 
background-color: $primary-color // Variable Called
```

# Mixins

Mixins are like sort of functions, saves times. Generally goes in `_mixins.scss`.

```scss
@mixins mixin-name{
    `Code Goes here`
}
```

You can also add arguments in mixins 

```scss
@mixin size($width, $height: $width) {
  width: $width;
  height: $height;
}
```

To call a mixin 

```scss
/*
    Variables in _variables.scss
    $width:150px;
    $height:150px;
 */

.img{
    @include($width, $height)
}

```
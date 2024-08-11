Sources  -- https://bem-cheat-sheet.9elements.com/, GPT , https://sass-guidelin.es/#architecture

# BEM (Block, Element, Modifier) is a naming convention for writing clean and maintainable CSS. 

- Block: The main component or section of the webpage. It’s like a container that holds elements. For example, a navigation menu, a button, or a form.
Example: menu, button, form

- Element: A part of the block that performs a specific function. Elements are always part of a block and can’t exist without it.
Example: menu__item, button__icon, form__input

- Modifier: A variation or state of a block or element. Modifiers are used to change the appearance or behavior.
Example: button--large, form__input--error

### Code Example

HTML Code

```html
<div class="card">
  <h2 class="card__title">Card Title</h2>
  <p class="card__description">This is a description of the card.</p>
  <button class="card__button card__button--primary">Learn More</button>
</div>
```

SCSS Code

```scss
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;

  &__title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  &__description {
    font-size: 16px;
    margin-bottom: 15px;
  }

  &__button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;

    &--primary {
      background-color: blue;
      color: white;
    }
  }
}
```

CSS Code
This is how scss to css code will be compiled when `npm build:css` is executed.

```css
/* Block: card */
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Element: card__title */
.card__title {
  font-size: 24px;
  margin-bottom: 10px;
}

/* Element: card__description */
.card__description {
  font-size: 16px;
  margin-bottom: 15px;
}

/* Element: card__button */
.card__button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

/* Modifier: card__button--primary */
.card__button--primary {
  background-color: blue;
  color: white;
}
```
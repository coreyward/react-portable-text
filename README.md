# React Portable Text

An easy way to render Portable Text block content in React applications.

## Quick Example

```sh
yarn add react-portable-text
```

```jsx
import PortableText from "react-portable-text"

const YourComponent = ({ portableTextContent }) => (
  <div>
    <PortableText
      // Pass in block content straight from Sanity.io
      content={portableTextContent}

      // Optionally override marks, decorators, blocks, etc. in a flat
      // structure without doing any gymnastics
      serializers={{
        h1: props => <h1 style={{ color: "red" }} {...props} />,
        li: ({ children }) => <li className="special-list-item">{children}</li>,
        someCustomType: YourComponent,
      }}
    />
  </div>
)
```

## Why not just use @sanity/block-content-to-react directly?

I found it difficult to create abstractions on top of
[@sanity/block-content-to-react](https://github.com/sanity-io/block-content-to-react).
Remembering whether a serializer needed to be codified as a `type`, a `mark`, or
as something under `block` was challenging, and the special treatment for lists
and list items was confusing. Further, the props being wrapped in an object
under the `node` property, or extraneous props for `mark` types meant I was
creating intermediate component types just to avoid passing invalid props to the
React elements (otherwise they render in the DOM).

React Portable Text uses `@sanity/block-content-to-react` under the hood, but
maps each of these types to the correct place in the serializers for you and
normalizing props to match the fields supplied by users in your Sanity Studio,
simplifying the cognitive load required to author new ones.

## Serializer Documentation

React Portable Text maps the following types explicitly, and treats all other
properties of the `serializers` object as custom types. Custom types are used
for both `type` and `block` blocks (i.e. custom marks as well as custom
block-level insertion types).

| Serializer   | Notes                                  |
| ------------ | -------------------------------------- |
| **Marks**    |
| `link`       | All `link` marks used for anchor links |
| `strong`     | Bold/strong text                       |
| `em`         | Emphasized/italic text                 |
| `underline`  | Underlined text                        |
| `del`        | Text with strikethrough styles         |
| `code`       | Inline text with `code styling`        |
| **Lists**    |
| `ul`         | Unordered lists                        |
| `ol`         | Ordered lists                          |
| `li`         | List items for any type of list        |
| **Blocks**   |
| `h1`         | Heading level 1                        |
| `h2`         | Heading level 2                        |
| `h3`         | Heading level 3                        |
| `h4`         | Heading level 4                        |
| `h5`         | Heading level 5                        |
| `h6`         | Heading level 6                        |
| `normal`     | Paragraph styles                       |
| `blockquote` | Blockquote styles                      |

### Additional Props

Additional props are passed through to `@sanity/block-content-to-react`, so if
you want to configure `imageOptions` or set the `projectId` and `dataset`
options you can just pass them directly to React Portable Text:

```jsx
<PortableText
  content={blockContent}
  projectId={process.env.SANITY_PROJECT_ID}
  dataset={process.env.SANITY_DATASET}
/>
```

## Rendering Plain Text

As a bonus, `react-portable-text` offers a function that will render your
portable text content to a plaintext string. This is often useful for previews
and such in the Studio and for ancillary uses of content in contexts where
formatting is not supported (e.g. calendar invite descriptions, meta tags,
etc.).

```jsx
import { blockContentToPlainText } from "react-portable-text"

const MetaDescription = ({ content }) => (
  <meta name="description" content={blockContentToPlainText(content)} />
)
```

## Contributing

Did I miss something? Is something not compatible with your setup?
[Open an issue](https://github.com/coreyward/react-portable-text/issues/new)
with details, and if possible, a CodeSandbox reproduction. Pull requests are
also welcomed!

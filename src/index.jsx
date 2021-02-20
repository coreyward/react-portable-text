import React from "react"
import PropTypes from "prop-types"
import SanityBlockContent from "@sanity/block-content-to-react"

/**
 * Renders an array of Portable Text blocks as React components.
 *
 * @param {object} props
 * @param {[object]} props.content Array of portable text blocks
 * @param {string} props.className Optional className
 * @param {object} props.serializers Optional serialization overrides
 * @returns
 */
const PortableText = ({ content, className, serializers = {} }) => {
  if (!content) throw new Error("No `content` provided to PortableText.")

  return (
    <SanityBlockContent
      blocks={content}
      renderContainerOnSingleChild
      className={className}
      serializers={buildSerializer(serializers)}
    />
  )
}

export default PortableText

PortableText.propTypes = {
  content: PropTypes.array.isRequired,
  className: PropTypes.string,
  serializers: PropTypes.shape({
    // Marks
    link: PropTypes.func,
    strong: PropTypes.func,
    em: PropTypes.func,
    underline: PropTypes.func,
    del: PropTypes.func,
    code: PropTypes.func,

    // Lists
    ul: PropTypes.func,
    ol: PropTypes.func,
    li: PropTypes.func,

    // Blocks
    h1: PropTypes.func,
    h2: PropTypes.func,
    h3: PropTypes.func,
    h4: PropTypes.func,
    blockquote: PropTypes.func,
  }),
}

const buildSerializer = (serializers) => {
  const {
    // Marks
    link,
    strong,
    em,
    underline,
    del,
    code,

    // Lists
    ul,
    ol,
    li,

    // Blocks
    h1,
    h2,
    h3,
    h4,
    blockquote,

    ...customSerializers
  } = serializers

  const blockSerializers = {
    h1,
    h2,
    h3,
    h4,
    blockquote,
  }

  return {
    marks: scrubMarkProps({
      link,
      strong,
      em,
      underline,
      code,
      "strike-through": del,
      ...customSerializers,
    }),
    list: (props) => {
      const { type, children } = props
      const overrideType = type === "bullet" ? ul : ol
      return overrideType
        ? overrideType({ children })
        : SanityBlockContent.defaultSerializers.list(props)
    },
    listItem: (props) => {
      const { children } = props
      return li
        ? li({ children })
        : SanityBlockContent.defaultSerializers.listItem(props)
    },
    types: {
      block: (props) => {
        const {
          node: { style },
          children,
        } = props
        return blockSerializers[style]
          ? blockSerializers[style]({ children })
          : customSerializers[style]
          ? customSerializers[style]({ children })
          : SanityBlockContent.defaultSerializers.types.block(props)
      },

      // Expand all custom serializers as `serializers.types` to handle
      // inserted types (i.e. not “styles” or “marks”), and parry `node`
      // so the recevied props match what would be retrieved normally:
      ...Object.entries(customSerializers).reduce(
        (output, [name, serializer]) => {
          const wrapper = ({ node }) => React.createElement(serializer, node)
          wrapper.displayName = `${upperFirst(name)}Wrapper`
          output[name] = wrapper

          return output
        },
        {}
      ),
    },
  }
}

// Remove extraneous block node data before passing as props to serializer
const scrubMarkProps = (serializers) =>
  Object.entries(serializers).reduce((output, [name, serializer]) => {
    if (serializer) {
      const wrapper = ({ mark: { _type, _key, ...props }, children }) =>
        React.createElement(serializer, props, children)
      wrapper.displayName = `${upperFirst(name)}Wrapper`
      output[name] = wrapper
    }

    return output
  }, {})

/**
 * Converts portable text block content to a plain text string without formatting.
 *
 * @param {[Object]} [blocks=[]] Portable text blocks
 */
export const blockContentToPlainText = (blocks = []) =>
  blocks
    .map((block) =>
      block._type === "block" && block.children
        ? block.children.map((span) => span.text).join("")
        : ""
    )
    .join("\n\n")

const upperFirst = (str) => str.slice(0, 1).toUpperCase() + str.slice(1)

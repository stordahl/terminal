type ParsedData = {
  posts?: Array<any>
  oss?: Array<any>
  email?:StaticDataProperty
  whois?:StaticDataProperty
  social?:StaticDataProperty
}

type StaticDataProperty = {
  text: Array<string>
}

const staticData:Partial<ParsedData> = {
  email: {
    text: ["<a href=''>jacob@stordahl.dev</a>"]
  },
  whois: {
    text: [
      "<h1>Hi, I'm Jacob.</h1>",
      "<p>I'm a Software Engineer, obsessed with building tools and infrastructure that enable front-end teams to be productive. Currently, I'm building radical ecommerce user experiences at Stylitics. Check out some of my open source work on <a href='https://github.com/stordahl'>Github</a>. You can reach me on <a href='https://twitter.com/stordahl_'>twitter</a> or shoot me an <a href='mailto:jacob@stordahl.dev'>email.</a></p>",
      "<p class='strike'>I'm currently available for hire.</p>",
    ],
  },
  social: {
    text: [
      "<p><a href='https://twitter.com/stordahl_' target='_blank'>Twitter dot com</a></p>",
      "<p><a href='https://github.com/stordahl' target='_blank'>Github</a></p>",
      "<p><a href='https://stordahl.dev' target='_blank'>GUI Version of this site</a></p>",
    ],
  },
}

export const parseData = (data:Array<any>) => {
  const obj:ParsedData = {...staticData}
  obj.posts = data.filter(x => x._type === 'post')
  obj.oss = data.filter(x => x._type === 'openSource')
  return obj
}
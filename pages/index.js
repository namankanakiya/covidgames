import { Component } from "react";
import Banner from "../components/banner";
import InputForm from "../components/inputform";
// import Contributors from '../components/contributors'

export default class Index extends Component {
  render() {
    const { projects } = this.props;
    return (
      <>
        <Banner />
        {/* <Contributors titles={titles} /> */}
        <InputForm />
      </>
    );
  }
}

export const getStaticProps = async () => {
  /*
  const { uniq, random, flatten, filter, shuffle, includes, take, trim } = require('lodash')
  const emoji = require('country-emoji')
  const loadJSON = require('load-json-file')
  // Only content version has creator names
  const list = await loadJSON('./lib/projects-content.json')
  let titles = []
  list.forEach(p => {
    let cr = p.creators
      .split(', ')
      .filter(n => !includes(n, /[0-9]+/))
      .filter(n => !includes(n, 'undefined'))
      .filter(() =>
        p.country === 'United States' ? random(1, true) < 0.3 : true
      )
      .map(trim)
    const co = emoji.flag(p.country)
    titles.push(cr.map(c => `${co} ${c}`))
  })
  titles = uniq(flatten(titles))
  titles = [take(shuffle(titles), 64), take(shuffle(titles), 64)]
  */
  // Getting min bundle for sending as props
  const { filter } = require("lodash");
  const { getProjectCards } = require("../lib/projects");
  let projects = await getProjectCards();
  projects = filter(projects, { feat: true });
  return { props: { projects } };
};

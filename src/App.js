import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
    this.svgRef = React.createRef(); 
  }

  componentDidUpdate() {
    this.renderChart(); 
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", 
      "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", 
      "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", 
      "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", 
      "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", 
      "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", 
      "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", 
      "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", 
      "doesn't", "didn't", "don't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't"
    ]);

    const words = text.toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");

   
    const filteredWords = words.filter(word => !stopWords.has(word));

   
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }

  renderChart() {
    const data = this.state.wordFrequency.sort((a, b) => b[1] - a[1]).slice(0, 5); 

    const svg = d3.select(this.svgRef.current); 

    const fontSizeScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
      .range([20, 80]);

    const svgWidth = 500; 
    const wordSpacing = svgWidth / data.length; 

    const wordGroup = svg.selectAll('text')
      .data(data, d => d[0]); 

    const offsets = [0, 180, 300, 350, 400]; 


    wordGroup
      .transition()
      .duration(1000)
      .style('font-size', d => fontSizeScale(d[1]) + 'px')
      .attr('x', (d, i) => i * wordSpacing + offsets[i]) 
      .attr('y', 150); 


    wordGroup.exit().remove();

    
    wordGroup.enter()
      .append('text')
      .attr('x', (d, i) => i * wordSpacing + offsets[i])
      .attr('y', 150) 
      .style('font-size', '1px') 
      .text(d => d[0]) 
      .transition()
      .duration(1000)
      .style('font-size', d => fontSizeScale(d[1]) + 'px')
      .attr('x', (d, i) => i * wordSpacing + offsets[i])
      .attr('y', 150);
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea 
            type="text" 
            id="input_field" 
            style={{ height: 150, width: 1000 }} 
          />
          <button
            type="submit"
            value="Generate Matrix"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              const input_data = document.getElementById("input_field").value;
              this.setState({ wordFrequency: this.getWordFrequency(input_data) });
            }}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg ref={this.svgRef} className="svg_parent" width="1000" height="300" style={{ backgroundColor: '#d3d3d3' }}></svg>
        </div>
      </div>
    );
  }
}

export default App;

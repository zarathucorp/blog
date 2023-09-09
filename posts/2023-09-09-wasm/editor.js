const editor = CodeMirror((elt) => {
    elt.style.border = '1px solid #eee';
    elt.style.height = 'auto';
    document.getElementById('editor').append(elt);
  },{
    value: 'random_numbers <- rnorm(100, mean = 10, sd = 2)\n\nmean_value <- mean(random_numbers)\nsd_value <- sd(random_numbers)\n\nprint(mean_value)\nprint(sd_value)',
    lineNumbers: true,
    mode: 'r',
    theme: 'light default',
    viewportMargin: Infinity,
  });
  
  import { WebR } from 'https://webr.r-wasm.org/latest/webr.mjs';
  const webR = new WebR();
  await webR.init();
  const shelter = await new webR.Shelter();

  async function runR() {
    let code = editor.getValue();
    const result = await shelter.captureR(code, {
      withAutoprint: true,
      captureStreams: true,
      captureConditions: false
    });
    try {
      const out = result.output.filter(
        evt => evt.type == 'stdout' || evt.type == 'stderr'
      ).map((evt) => evt.data);
      document.getElementById('out').innerText = out.join('\n');
    } finally {
      shelter.purge();
    }
  }
  document.getElementById('runButton').onclick = runR;
  document.getElementById('runButton').innerText = 'Run code';
  document.getElementById('runButton').disabled = false;

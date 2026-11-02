document.addEventListener("DOMContentLoaded", () => {
    const resolver = document.getElementById("resolver");
    resolver.addEventListener("click", (resol) => {
        resol.preventDefault();

        const a = leer("input-a");
        const b = leer("input-b");
        const c = leer("input-c");

        const text_ec = document.getElementById("salida-ecuacion");
        const text_ra = document.getElementById("salida-raices");
        const text_so = document.getElementById("salida-soluciones");
        const text_ge = document.getElementById("salida-genral");

        vaciar(text_ec, text_ra, text_so, text_ge);

        text_ec.innerHTML = ecuacion_caracteristica(a, b, c);

        if (a === 0) {
            if (b === 0) return;

            const m = -c / b;
            const e = eval_exp(m);

            text_ra.innerHTML = `m = ${Number(m.toFixed(2))}`;
            text_so.innerHTML = `y = ${e}`;
            text_ge.innerHTML = e === "1" ? `y = c` : `y = c ${e}`;
            return;
        }

        const det = b * b - 4 * a * c;

        if (det > 0) {
            const sq = Math.sqrt(det);
            const m1 = (-b - sq) / (2 * a);
            const m2 = (-b + sq) / (2 * a);
            const e1 = eval_exp(m1);
            const e2 = eval_exp(m2);

            text_ra.innerHTML = `m<sub>1</sub> = ${Number(m1.toFixed(2))}<br>m<sub>2</sub> = ${Number(m2.toFixed(2))}`;
            text_so.innerHTML = `y<sub>1</sub> = ${e1}<br>y<sub>2</sub> = ${e2}`;
            text_ge.innerHTML = `y<sub>c</sub> = c<sub>1</sub>${e1 === "1" ? "" : ` ${e1}`} + c<sub>2</sub>${e2 === "1" ? "" : ` ${e2}`}`;

        } else if (det === 0) {
            const m = -b / (2 * a);
            const e = eval_exp(m);

            text_ra.innerHTML = `m<sub>1</sub> = m<sub>2</sub> = ${Number(m.toFixed(2))}`;
            text_so.innerHTML = `y<sub>1</sub> = ${e}<br>y<sub>2</sub> = x${e === "1" ? "" : ` ${e}`}`;
            text_ge.innerHTML = `y<sub>c</sub> = c<sub>1</sub>${e === "1" ? "" : ` ${e}`} + c<sub>2</sub>${e === "1" ? " x" : ` x ${e}`}`;

        } else {
            const alpha = -b / (2 * a);
            const beta = Math.sqrt(-det) / (2 * Math.abs(a));
            const alpha_val = Number(alpha.toFixed(2));
            const beta_val = Number(beta.toFixed(2));

            const e = eval_exp(alpha);
            const cos = eval_tri("Cos", beta);
            const sen = eval_tri("Sen", beta);
            const dentro = `c<sub>1</sub> ${cos} + c<sub>2</sub> ${sen}`;

            text_ra.innerHTML = `m<sub>1</sub> = ${alpha_val} + ${beta_val}i<br>m<sub>2</sub> = ${alpha_val} - ${beta_val}i`;

            const term1 = e === "1" ? cos : `${e} ${cos}`;
            const term2 = e === "1" ? sen : `${e} ${sen}`;

            text_so.innerHTML = `y<sub>1</sub> = ${term1}<br>y<sub>2</sub> = ${term2}`;
            text_ge.innerHTML = `y<sub>c</sub> =` + (e === "1" ? ` ${dentro}` : ` ${e} [ ${dentro} ]`);
        }
    });
});

const coef = (n) => (n === 1 ? "" : n === -1 ? "-" : `${Number(n.toFixed(2))}`);

function ecuacion_caracteristica(a, b, c) {
    const terminos = [];

    if (a !== 0) terminos.push(`${coef(a)} m<sup>2</sup>`);
    if (b !== 0) terminos.push(`${coef(b)} m`);
    if (c !== 0) terminos.push(`${Number(c.toFixed(2))}`);

    if (terminos.length === 0) return `0 = 0`;
    if (a === 0 && b === 0) return `Ec Diferencial no valida`;
    return terminos.join(" + ").replace(/\+ -/g, " - ") + " = 0";
}

const leer = (id) => {
    const v = document.getElementById(id).valueAsNumber;
    return Number.isNaN(v) ? 0 : v;
};

function vaciar(...els) {
    els.forEach((el) => (el.innerHTML = ""));
}

const es_cero = (n) => Math.abs(n) < 0.005;

function eval_exp(n) {
    if (es_cero(n)) return `1`;
    if (es_cero(n - 1)) return `e<sup>x</sup>`;
    if (es_cero(n + 1)) return `e<sup>-x</sup>`;
    return `e<sup>${Number(n.toFixed(2))}x</sup>`;
}

const coef_arg = (n) => {
    if (es_cero(n - 1)) return "x";
    if (es_cero(n + 1)) return "-x";
    return `${Number(n.toFixed(2))}x`;
};

function eval_tri(trig, n) {
    if (es_cero(n)) return trig === `Cos` ? `1` : `0`;
    return `${trig}(${coef_arg(n)})`;
}
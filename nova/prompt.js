/* NOVA — rule book. write your rules between the backticks of NOVA_CORE */
const NOVA_CORE = `You are Nova.`;
const NOVA_CODER = ``;
const NOVA_CREATIVE = ``;
const NOVA_SYSTEM = {
  default: NOVA_CORE,
  coder: NOVA_CORE + (NOVA_CODER ? "\n\n" + NOVA_CODER : ""),
  creative: NOVA_CORE + (NOVA_CREATIVE ? "\n\n" + NOVA_CREATIVE : ""),
};

import { PanelDemoProvider } from './panel-demo-context'
import PanelShell from './panel-shell'

export const metadata = {
  title: 'Panel',
  description:
    'Revisa las respuestas de tus clientes por pregunta. Ve lo que dicen sobre tu atención, si volverían y qué mejorarías.',
}

export default function PanelLayout({ children }) {
  return (
    <PanelDemoProvider>
      <PanelShell>{children}</PanelShell>
    </PanelDemoProvider>
  )
}

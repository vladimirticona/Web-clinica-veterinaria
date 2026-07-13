# ADR-004: Adopción de Kubernetes y GitOps con ArgoCD

## Estado
Aceptado

## Contexto
En la fase de DevOps del curso se requería automatizar el despliegue del sistema con trazabilidad y versionamiento de la infraestructura.

## Decisión
Se adoptó Kubernetes (Minikube para desarrollo local) con GitOps mediante ArgoCD.

## Estructura
- Repositorio de aplicación: código fuente y Dockerfile
- Repositorio de configuración: manifiestos YAML de Kubernetes
- GitHub Actions: pipeline CI/CD con SemVer 2.0.0
- ArgoCD: sincronización continua entre Git y el clúster

## Razones
- Separación de responsabilidades entre código e infraestructura (IEEE 828)
- Trazabilidad completa de cambios en el clúster
- Self-healing automático ante drift de configuración

## Consecuencias
- Mayor complejidad operativa
- Total automatización del despliegue
- Historial auditable de todos los cambios de infraestructura
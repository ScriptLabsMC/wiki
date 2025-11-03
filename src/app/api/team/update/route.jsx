import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    const { action, ...memberData } = data;

    // Ruta al archivo team.json
    const filePath = path.join(process.cwd(), 'public', 'data', 'team.json');

    // Leer el archivo existente
    let teamData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      teamData = JSON.parse(fileContent);
    }

    switch (action) {
      case 'create':
      case 'update':
        // Validar campos requeridos
        if (!memberData.id || !memberData.name || !memberData.role || !memberData.bio) {
          return NextResponse.json(
            { error: 'Faltan campos requeridos: id, name, role, bio' },
            { status: 400 }
          );
        }

        // Procesar badges
        const badges = memberData.badges
          ? typeof memberData.badges === 'string'
            ? memberData.badges.split(',').map(badge => badge.trim()).filter(badge => badge)
            : memberData.badges
          : [];

        const processedMember = {
          id: memberData.id,
          name: memberData.name,
          role: memberData.role,
          avatar: memberData.avatar || `/media/avatar_${memberData.id}.png`,
          bio: memberData.bio,
          badges: badges
        };

        const existingIndex = teamData.findIndex(member => member.id === memberData.id);

        if (existingIndex !== -1) {
          // Actualizar miembro existente
          teamData[existingIndex] = processedMember;
        } else {
          // Agregar nuevo miembro
          teamData.push(processedMember);
        }
        break;

      case 'delete':
        if (!memberData.id) {
          return NextResponse.json(
            { error: 'ID requerido para eliminar' },
            { status: 400 }
          );
        }

        const deleteIndex = teamData.findIndex(member => member.id === memberData.id);
        if (deleteIndex === -1) {
          return NextResponse.json(
            { error: 'No se encontró ningún miembro con ese ID' },
            { status: 404 }
          );
        }

        teamData.splice(deleteIndex, 1);
        break;

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

    // Escribir el archivo actualizado
    fs.writeFileSync(filePath, JSON.stringify(teamData, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: `Miembro ${action === 'delete' ? 'eliminado' : (teamData.find(m => m.id === memberData.id) ? 'actualizado' : 'agregado')}`,
      data: action === 'delete' ? null : teamData.find(m => m.id === memberData.id)
    });

  } catch (error) {
    console.error('Error updating team data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
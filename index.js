const { Client, IntentsBitField, ActivityType } = require('discord.js')
const client = new Client(
    { intents: new IntentsBitField(3276799) }
)

const config = require('./config.json')

const guildId = '1278816148137181196'

const roleToUpdate = [
    { id: '1278825188082843771', baseName: '⛩️・Gestion Recrutement', maxCount: 15 },
    { id: '1278825192193523853', baseName: '🛡️・Gestion Abus', maxCount: 10 },
    { id: '1278825135125696572', baseName: '👘・Chef Gestion', maxCount: 4 },
]

client.on('guildMemberUpdate', async (oldMamber, newMember) => {
    const addedRoles = newMember.roles.cache.filter(role => !oldMamber.roles.cache.has(role.id))
    const removedRoles = oldMamber.roles.cache.filter(role =>!newMember.roles.cache.has(role.id))

    for (const roleInfo of roleToUpdate) {
        if (addedRoles.has(roleInfo.id) || removedRoles.has(roleInfo.id)) {
            await updateRoleName(newMember.guild, roleInfo)
        }
    }
})

client.on('ready', async () => {
    console.log(`Connected as ${client.user.tag}`)

    client.user.setActivity(
        {
            name: 'discord.gg/nasuna',
            type: ActivityType.Streaming,
        },
    )

    await uptdateAllRoles();
    console.log("Le noms des rôles suivis on été correctement mis a jour")
})

async function uptdateAllRoles() {
    try {
        const guild = client.guilds.fetch(guildId)

        for (const roleInfo of roleToUpdate) {
            await updateRoleName(guild, roleInfo)
        }
    } catch (error) {
        console.error('Erreur lors de la mise a jour des rôles:', error)
    }
}

async function updateRoleName(guild, roleInfo) {
    try {
        const role = await guild.roles.fetch(roleInfo.id)

        if (!role) {
            console.error(`Le rôle ${roleInfo.baseName} n'a pas été trouvé`)
            return
        }

        const memberWithRole = role.members.size
        const newRoleName = `${roleInfo.baseName} (${memberWithRole}/${roleInfo.maxCount})`

        if (role.name !== newRoleName) {
            await role.setName(newRoleName)
            console.log(`Le nom du rôle ${roleInfo.baseName} a été mis à jour en ${newRoleName}`)
        }
    } catch (error) {}
}

client.login(config.token).catch((err) => {
    console.error('Failed to connect to Discord:', err)
    process.exit(1)
})